import React, { useState } from 'react';

export default function DemoButton() {
    const [count, setCount] = useState(0);

    return (
        <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-neutral-900 dark:bg-zinc-50 text-zinc-50 dark:text-neutral-900 rounded-md hover:opacity-90 transition-opacity font-medium"
        >
            Clicked {count} {count === 1 ? 'time' : 'times'}
        </button>
    );
}
