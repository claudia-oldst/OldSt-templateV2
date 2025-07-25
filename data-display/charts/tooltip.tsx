import { DataKeys } from '@ui-types/chart';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import Card from '../card/card';
import Typography from '../typography/typography';

interface ICustomTooltip extends TooltipProps<ValueType, NameType> {
    dataKeys?: DataKeys[],
    unit?: string,
    isUnitPrefix?: boolean
}

export const CustomTooltip = ({ active, payload, label, dataKeys, unit, isUnitPrefix }: ICustomTooltip) => {
    if (active && payload && payload.length) {
        return (
            <Card className='px-4 py-3 flex flex-col gap-2 drop-shadow-elevation-05'>
                {Boolean(label) &&
                    <Typography fontWeight='font-bold' className='mb-4'>{label}</Typography>
                }

                {payload.map((data, i) => {
                    const title = dataKeys?.find(dk => dk.key === data.name)?.name || '';

                    return <div className='flex flex-row items-center gap-4' key={i}>
                        <div className='flex flex-row items-center gap-2 flex-1'>
                            <div className='h-3 w-3 rounded-full' style={{ background: data.color || data.payload.color }} />
                            <Typography
                                color='text-N700'
                                size='text-sm'
                                fontWeight='font-medium'
                                className='leading-3'>{title || data.name}</Typography>
                        </div>

                        <Typography color='text-N700' size='text-sm'>
                            {(unit && isUnitPrefix) && unit} {data.value}{(unit && !isUnitPrefix) && unit}
                        </Typography>
                    </div>;
                })}
            </Card>
        );
    }

    return null;
};
