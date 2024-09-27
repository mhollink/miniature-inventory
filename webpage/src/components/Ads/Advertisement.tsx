import React, { useEffect } from "react";

interface AdSenseComponentProps {
  client: string;
  slot: string;
  style?: React.CSSProperties;
  format?: string;
  responsive?: string;
}

export const AdSenseComponent: React.FC<AdSenseComponentProps> = ({
  client,
  slot,
  style,
  format = "auto",
  responsive = "true",
}) => {
  const pushAd = () => {
    try {
      // @ts-expect-error adsbygoogle is not by default on window, as such typescript is going to bitch about it...
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  };

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    );

    if (!existingScript) {
      // Load the AdSense script if it's not already loaded
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);

      script.onload = () => {
        pushAd();
      };
    } else {
      // The script is already loaded, just push the ad
      pushAd();
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};
