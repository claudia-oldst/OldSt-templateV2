import colors from '@ui-config/colors';

type SortableObject = { value: string, sort: number };

const generateColorVariants = () => {
    const keys = Object.keys(colors);

    return keys.reduce((curr: SortableObject[], key) => {
        const split = key.match(/([a-zA-Z]+)(\d+)/) || [];

        if (key.length < 5 && split[2].length > 2 && parseInt(split[2]) <= 500) {
            curr.push({
                value: key,
                sort: Math.floor((Math.random() * 100) + 1)
            });
        }

        return curr;
    }, []).sort((a: SortableObject, b: SortableObject) => {
        return a.sort - b.sort;
        // const fa = a.sort.toLowerCase();
        // const fb = b.sort.toLowerCase();

        // if (fa > fb) {
        //     return -1;
        // }

        // if (fa < fb) {
        //     return 1;
        // }

        // return 0;
    }).map(v => v.value);
};

export const COLOR_VARIANTS = generateColorVariants();