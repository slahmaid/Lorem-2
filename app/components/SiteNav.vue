<template>
	<nav class="fixed inset-x-0 top-0 z-10 flex justify-center p-safe-20 text-black touch:pointer-events-none s:p-safe-40">
		<div ref="bar" class="bar flex items-center justify-between">
			<span class="wordmark shrink-0 text-16 leading-12 font-medium tracking-body">
				Chlah<span class="stop">.</span>
			</span>

			<div class="flex items-center gap-20 touch:pointer-events-auto s:gap-60">
				<div class="hidden items-start gap-30 s:flex">
					<a
						v-for="link in LINKS"
						:key="link.id"
						:href="`#${link.id}`"
						class="shrink-0 text-16 leading-12 font-medium tracking-body touch:-my-[12px] touch:py-[12px] touch:text-[length:max(1.6rem,14px)]"
						@click.prevent="go(link.id)"
					>{{ link.label }}</a>
				</div>

				<site-button label="Get in touch" to="mailto:hello@example.com" />

				<button
					ref="toggle"
					type="button"
					class="flex size-40 shrink-0 items-center justify-center bg-black text-white transition-opacity duration-350 ease-out active:opacity-70 s:hidden"
					:aria-expanded="open"
					aria-controls="site-menu"
					:aria-label="open ? 'Close menu' : 'Open menu'"
					@click="flip"
				>
					<span
						class="font-mono text-16 leading-10 font-normal transition-[rotate] duration-700 ease-expo"
						:class="{ 'rotate-45': open }"
						aria-hidden="true"
					>+</span>
				</button>
			</div>
		</div>

		<div
			id="site-menu"
			class="fixed inset-0 -z-10 flex flex-col justify-end bg-ground p-safe-20 pb-[max(6rem,env(safe-area-inset-bottom))] transition-[opacity,visibility] duration-350 ease-out s:hidden"
			:class="open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'"
			@wheel.stop
		>
			<span class="mb-40 font-mono text-12 leading-10 font-normal tracking-label text-ink/60 uppercase">Menu</span>

			<ul class="flex flex-col items-start gap-15">
				<li v-for="(item, i) in MENU" :key="item.label" class="w-full">
					<a
						:href="item.id ? `#${item.id}` : item.to"
						class="block w-full py-5 text-60 leading-10 font-medium tracking-h2 transition-[translate,opacity] duration-700 ease-expo"
						:class="open ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'"
						:style="{ transitionDelay: open ? `${80 + i * 60}ms` : '0ms' }"
						@click="pick(item, $event)"
					>{{ item.label }}</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { Spring } from '@domgl/motion'

const LINKS = [
	{ id: 'projects', label: 'Projects' },
	{ id: 'culture', label: 'Culture' },
]

type Item = { label: string; id?: string; to?: string }

const MENU: Item[] = [...LINKS, { label: 'Get in touch', to: 'mailto:hello@example.com' }]

// Mirrors --breakpoint-s in main.css: the sheet and its toggle only exist below it
const WIDE = '(width >= 1000px)'

const ON = 60
const OFF = 20

const bar = useTemplateRef<HTMLElement>('bar')

const { $write, $scrollY, $scrollTo } = useNuxtApp()

const toggle = useTemplateRef<HTMLButtonElement>('toggle')

const open = ref(false)

// Every close goes through here, so focus returns to the toggle unless the caller moves it
const close = (restore = true) => {
	if (!open.value) return

	open.value = false

	if (restore) toggle.value?.focus()
}

const flip = () => {
	if (open.value) close()
	else open.value = true
}

const go = (id: string) => {
	const el = document.getElementById(id)
	if (!el) return

	$scrollTo(el)

	// Move the reading/tab position along with the viewport
	el.tabIndex = -1
	el.focus({ preventScroll: true })
}

const pick = (item: Item, e: MouseEvent) => {
	// mailto: the page stays, so focus returns to the toggle
	if (!item.id) return close()

	e.preventDefault()

	close(false)
	go(item.id)
}

const onKey = (e: KeyboardEvent) => {
	if (e.key === 'Escape') close()
}

const stick = new Spring(0, { response: 0.5, dampingRatio: 1 })

let stuck = false

let unWrite: (() => void) | null = null

onMounted(() => {
	window.addEventListener('keydown', onKey)

	const wide = window.matchMedia(WIDE)
	// The toggle is display:none from here up, so there is nothing to hand focus back to
	const onWide = () => { if (wide.matches) close(false) }

	wide.addEventListener('change', onWide)
	onScopeDispose(() => wide.removeEventListener('change', onWide))

	unWrite = $write((ratio: number) => {
		const y = $scrollY()

		if (!stuck && y > ON) {
			stuck = true
			stick.setTarget(1)
		} else if (stuck && y < OFF) {
			stuck = false
			stick.setTarget(0)
		}

		if (stick.sleeping) return

		stick.step(Math.max(ratio, 0.25) / 60)

		bar.value?.style.setProperty('--stick', `${stick.value}`)
	})
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKey)
	unWrite?.()
})
</script>

<style scoped>
.bar {
	--wide: 100%;
	--tight: 80rem;

	--pad-x: 2rem;
	--pad-r: 1rem;
	--pad-y: 1rem;

	width: min(100%, calc(var(--wide) + var(--stick) * (var(--tight) - var(--wide))));

	padding-left: calc(var(--stick) * var(--pad-x));
	padding-right: calc(var(--stick) * var(--pad-r));
	padding-block: calc(var(--stick) * var(--pad-y));

	background-color: color-mix(in srgb, var(--color-raised) calc(var(--stick) * 100%), transparent);

	border: 1px solid color-mix(in srgb, var(--color-line) calc(var(--stick) * 100%), transparent);
}

.wordmark,
.stop {
	--stick: inherit;
}

.stop {
	opacity: var(--stick);
}
</style>
