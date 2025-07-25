import Typography from '../typography/typography';

/* eslint-disable-next-line */
export interface PageHeaderProps {
    title: string,
    leftAction?: JSX.Element,
    rightAction?: JSX.Element,
    isMainPage?: boolean
}

export function PageHeader({ title, leftAction, rightAction, isMainPage = true }: PageHeaderProps) {
    return (
        <div className='flex row justify-between items-center'>
            <div className='flex row items-center gap-2'>
                <Typography
                    fontWeight='font-bold'
                    size={isMainPage ? 'text-3xl' : 'text-2xl'}>
                    {title}
                </Typography>
                {leftAction && leftAction}
            </div>

            {rightAction && rightAction}
        </div>
    );
}

export default PageHeader;
