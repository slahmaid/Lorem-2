<template>
	<component
		:is="to ? 'a' : 'button'"
		:href="to"
		:type="to ? undefined : 'button'"
		class="btn relative flex h-40 w-fit shrink-0 items-center justify-center gap-60 overflow-hidden bg-black px-15 touch:s:min-h-[44px]"
	>
		<span class="font-mono text-12 leading-10 font-normal tracking-label uppercase text-white touch:s:text-[length:max(1.2rem,11px)]">{{ label }}</span>

		<span class="glyph flex size-15 shrink-0 items-center justify-center font-mono text-12 leading-10 font-normal tracking-label uppercase text-black" aria-hidden="true">+</span>

		<span class="face absolute inset-0 bg-white" aria-hidden="true">
			<span class="rider absolute inset-0 flex items-center justify-center gap-60 px-15 text-black">
				<span class="font-mono text-12 leading-10 font-normal tracking-label uppercase touch:s:text-[length:max(1.2rem,11px)]">{{ label }}</span>
				<span class="glyph flex size-15 shrink-0 items-center justify-center font-mono text-12 leading-10 font-normal tracking-label uppercase">+</span>
			</span>
		</span>

		<span class="pointer-events-none absolute inset-0 border border-black" />
	</component>
</template>

<script setup lang="ts">
defineProps<{
	label: string
	to?: string
}>()
</script>

<style scoped>
.btn {
	--open: 0;

	--inset-x: 1.5rem;
	/* Height-relative so the resting window behind the glyph stays a 1.5rem square at any button height */
	--inset-y: calc(50% - 0.75rem);

	--over: 0.3rem;

	--nudge: 0.47rem;

	--pivot: calc((1 - var(--open)) * (100% - 2.25rem) + var(--open) * 50%);

	transition: --open 700ms var(--ease-expo);
}

.btn:focus-visible {
	--open: 1;
}

/* Hover only where it exists: a tap would otherwise leave the button inverted */
@media (hover: hover) and (pointer: fine) {
	.btn:hover {
		--open: 1;
	}
}

/* Press feedback on touch: a quick flip in, the usual ease back out */
html.touch .btn:active {
	--open: 1;
	transition-duration: 200ms;
}

.face {
	clip-path: inset(
		calc((1 - var(--open)) * var(--inset-y) - var(--open) * var(--over))
		calc((1 - var(--open)) * var(--inset-x) - var(--open) * var(--over))
		calc((1 - var(--open)) * var(--inset-y) - var(--open) * var(--over))
		calc((1 - var(--open)) * (100% - var(--inset-x) * 2) - var(--open) * var(--over))
	);
	transform: rotate(calc(var(--open) * 180deg));
	transform-origin: var(--pivot) 50%;
}

.rider {
	transform: rotate(calc(var(--open) * -180deg));
	transform-origin: var(--pivot) 50%;
}

.glyph {
	transform: translateX(calc(var(--open) * var(--nudge)));
}
</style>
