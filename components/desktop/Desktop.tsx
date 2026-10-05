import { DesktopIcons } from "./DesktopIcons";
import { MenuBar } from "./MenuBar";

export function Desktop({ children }: { children: React.ReactNode }) {
  return (
    <div className="screen">
      <MenuBar />
      <div className="desktop">
        {/* Daniel Powell, Chicago at night in the rain, 2008. CC BY 2.0, Wikimedia Commons. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="wallpaper"
          src="/desktop/wallpaper.jpg"
          alt=""
          width={1920}
          height={1425}
        />
        <div className="night-veil no-print" aria-hidden="true" />
        <div className="rain no-print" aria-hidden="true" />
        <DesktopIcons />
        <div className="window-layer">{children}</div>
      </div>
    </div>
  );
}
