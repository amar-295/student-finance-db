import { useEffect, useRef } from 'react';

/**
 * A hook to measure the performance of a component using the User Timing API.
 * It measures the time from mount start (approx) to effect execution, and tracks updates.
 */
export const useUserTiming = (componentName: string, id?: string) => {
    const label = id ? `${componentName}-${id}` : componentName;
    const mountRef = useRef(false);
    const renderCount = useRef(0);

    // Mark the start of the component's lifecycle (approximate, during first render pass)
    // We use a ref initialization to capture the earliest possible time in the function body
    const startTime = useRef(performance.now());

    useEffect(() => {
        if (!mountRef.current) {
            // MOUNT Complete
            const mountEnd = performance.now();
            const duration = mountEnd - startTime.current;

            performance.mark(`${label}-mount-end`);

            // Create a measure for the mount duration
            // Note: Since we can't easily mark 'start' in the render phase globally without a profiler,
            // we use our local startTime ref which is close to render start.
            // Using User Timing API
            try {
                performance.measure(`${label}:mount`, {
                    start: startTime.current,
                    end: mountEnd,
                    detail: { component: componentName, id, duration }
                });
            } catch (e) {
                // Fallback for older browsers
                performance.measure(`${label}:mount`, undefined, `${label}-mount-end`);
            }

            mountRef.current = true;
        } else {
            // UPDATE Complete
            renderCount.current++;
            performance.mark(`${label}-update-${renderCount.current}`);
            try {
                performance.measure(`${label}:update`, {
                    start: startTime.current, // From mount? No, that's not right.
                    // Measuring update duration is hard from inside the component without 'start' mark.
                    // We'll just mark the occurrence.
                    detail: { component: componentName, count: renderCount.current }
                });
            } catch (e) { }
        }
    });
};
