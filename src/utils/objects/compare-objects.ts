type Diff<T> = {
    [K in keyof T]?: { oldValue: T[K]; newValue: T[K] };
};

export function compareObjects<T>(obj1: T, obj2: T): Diff<T> {
    const differences: Diff<T> = {};

    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
            differences[key] = { oldValue: obj1[key], newValue: obj2[key] };
        }
    }

    return differences;
}