export function FigureCap({srcfile, alt, children}){
    return (
        <figure className='flex flex-col items-center my-2'>
            <img src={srcfile} alt={alt} className='w-full sm:w-2/3 md:w-1/2 rounded' />
            <figcaption className='text-xs italic text-base-content/60 mt-1 text-center'>
                {children}
            </figcaption>
        </figure>        
    );
}

export function SmallerFigureCap({srcfile, alt, children}){
    return (
        <figure className='flex flex-col items-center w-full sm:w-3/4 md:w-1/2 lg:w-2/5'>
                <img src={srcfile} alt={alt} className='w-full rounded' />
                <figcaption className='text-xs italic text-white mt-1 text-center'>
                    {children}
                </figcaption>
        </figure>       
    );
}