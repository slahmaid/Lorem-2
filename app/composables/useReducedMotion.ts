const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * True while the OS asks for reduced motion (iOS "Reduce Motion", Android
 * "Remove animations"). The GL library already honours it for text reveals
 * and the fluid; this covers the app's own marquees, drift and auto-advance.
 */
export const useReducedMotion = () => {
	const still = ref(false)

	onMounted(() => {
		const mql = window.matchMedia(QUERY)

		const read = () => { still.value = mql.matches }

		read()

		mql.addEventListener('change', read)
		onScopeDispose(() => mql.removeEventListener('change', read))
	})

	return still
}
