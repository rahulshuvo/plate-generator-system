import { useEffect, useState } from "react";

export default function useImage(url: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) {
      setImg(null);
      return;
    }

    const im = new Image();
    im.crossOrigin = "anonymous";

    im.onload = () => {
      setImg(im);
    };

    im.onerror = () => {
      setImg(null);
    };

    im.src = url;
  }, [url]);

  return { img };
}
