export default function SmallerFigureCap({srcfile, alt, children}){
    return (
        <figure className='flex flex-col items-center w-full sm:w-3/4 md:w-1/2 lg:w-2/5'>
                <img src={srcfile} alt={alt} className='w-full rounded' />
                <figcaption className='text-xs italic text-white mt-1 text-center'>
                    {children}
                </figcaption>
        </figure>       
    );
}

