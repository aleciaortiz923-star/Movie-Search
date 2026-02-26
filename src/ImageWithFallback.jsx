import { useState } from 'react';

const ImageWithFallback = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const fallbackSrc = "https://via.placeholder.com/300x450?text=Updating+movie+poster";

    const handleError = () => {
        setImgSrc(fallbackSrc);
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;
