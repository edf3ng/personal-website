import { DesktopIcons } from "./DesktopIcons";
import { MenuBar } from "./MenuBar";

export function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen">
      <MenuBar />
      <div className="desktop">
        {/* Alex Wong, City Lights at Night, 2015. CC0 via Unsplash / Wikimedia Commons. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="wallpaper"
          src="/desktop/wallpaper.jpg?v=skyline"
          alt=""
          width={1920}
          height={1280}
        />
        <div className="night-veil no-print" aria-hidden="true" />
        <div className="bokeh no-print" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <DesktopIcons />
        <div className="window-layer">{children}</div>
      </div>
    </div>
  );
}
