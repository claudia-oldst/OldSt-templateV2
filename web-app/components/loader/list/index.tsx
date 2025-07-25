export const ListLoader = () => {
    return (
        <div role='status' >
            <div className='animate-pulse w-full flex items-center justify-between py-8'>
                <div className='w-1/4 h-2 bg-ui-04 rounded-full dark:bg-ui-03' />
                <div className='flex items-center justify-between gap-2'>
                    <div className='h-2.5 bg-[#d6d6d6] rounded-full dark:bg-ui-05 w-20' />
                    <div className='h-2.5 bg-ui-04 rounded-full dark:bg-ui-03 w-20' />
                </div>
            </div>

            <div className='w-full p-4 space-y-4 border border-ui-04 divide-y divide-ui-04 rounded shadow animate-pulse dark:divide-ui-03 md:p-6 dark:border-ui-03'>
                {[...Array(10)].map((_, i) =>
                    <div className='flex items-center justify-between pt-4' key={i}>
                        <div className='flex-1'>
                            <div className='h-2.5 bg-ui-04 rounded-full dark:bg-ui-03 w-1/4 mb-2.5' />
                            <div className='w-2/4 h-2 bg-[#d6d6d6] rounded-full dark:bg-ui-05' />
                        </div>
                        <div className='h-2.5 bg-ui-04 rounded-full dark:bg-ui-03 w-12' />
                    </div>
                )}
                <span className='sr-only'>Loading...</span>
            </div>
        </div>
    );
};
