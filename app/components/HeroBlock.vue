<template>
	<section class="relative flex h-svh flex-col p-20 s:p-40">

		<div class="relative flex flex-1 flex-col items-center justify-center gap-10 s:flex-row">
			<!-- On touch the panel morph never runs, so the band stays a static graphic above the word -->
			<div ref="band" class="aspect-[18/13] w-120 shrink-0 bg-black gpu:bg-transparent touch:bg-black s:w-180" />

			<gl-text
				tag="h1"
				:reveal="false"
				class="shrink-0 text-120 leading-9 font-medium tracking-h2 s:text-175"
			>Chlah</gl-text>
		</div>
	</section>
</template>

<script setup lang="ts">
const band = useTemplateRef<HTMLElement>('band')

defineExpose({ band })
</script>
