export const FormLoader = () => {
    return (
        <div role='status' >
            <div className='animate-pulse w-full flex items-center justify-between pb-8'>
                <div className='w-1/4 h-4 bg-ui-04 rounded dark:bg-ui-03' />
            </div>

            <div>
                {[...Array(3)].map((_, i) =>
                    <div key={i} className='flex gap-4'>
                        {
                            [...Array(2)].map((_, y) =>
                                <div className='py-4 w-1/2' key={y}>
                                    <div className='h-2 bg-ui-04 rounded dark:bg-ui-03 w-1/4 mb-2.5' />
                                    <div className='w-full h-5 bg-[#d6d6d6] rounded dark:bg-ui-05' />
                                </div>
                            )
                        }
                    </div>
                )}
            </div>

            <div className='py-4'>
                <div className='h-2 bg-ui-04 rounded dark:bg-ui-03 w-1/4 mb-2.5' />
                <div className='w-full h-16 bg-[#d6d6d6] rounded dark:bg-ui-05' />
            </div>

            <span className='sr-only'>Loading...</span>
        </div>
    );
};
