import { useEffect, useState } from "react";

export function useScrollHeader(limit = 220) {
    const [compacto, setCompacto] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setCompacto(window.scrollY > limit);
      };

      window.addEventListener("scroll", handleScroll);

      return () =>
        window.removeEventListener("scroll", handleScroll);
    }, [limit]);

    return compacto;
  }