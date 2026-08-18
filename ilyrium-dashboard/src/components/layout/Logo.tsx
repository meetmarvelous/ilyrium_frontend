import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "w-8 h-8", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`${className} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
        <svg viewBox="0 0 2400 2400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="currentColor" className="text-primary" d="M1177.44 360.292C1329.1 353.234 1487.72 397.031 1619.06 471.485C1541.42 509.112 1462.92 544.94 1383.62 578.94C1267.74 545.026 1153.25 540.6 1035.64 570.557C870.616 612.846 729.122 718.897 642.226 865.422C554.449 1013.74 529.897 1191.1 574.079 1357.68C578.021 1372.5 582.51 1387.16 587.538 1401.64C555.078 1475.64 515.554 1553.43 477.888 1624.83C406.603 1500.92 368.254 1374.33 362.596 1230.91C353.89 1008.58 434.078 791.942 585.439 628.862C741.217 460.27 949.118 369.093 1177.44 360.292Z"/>
          <path fill="currentColor" className="text-primary" d="M1953.98 830.552C1963.71 840.836 1992.42 919.452 1997.75 935.601C2053.43 1104.49 2054.18 1286.68 1999.9 1456.02C1931.18 1668.9 1780.49 1845.64 1581.15 1947.15C1377.69 2051.02 1149.27 2064.46 932.996 1994.27C889.348 1979.48 855.753 1964.38 814.76 1944.09C835.098 1932.8 878.986 1914.59 901.344 1904.65C962.136 1877.65 1023.15 1851.16 1084.38 1825.18C1145.27 1835.65 1207.33 1837.41 1268.71 1830.38C1437.42 1810.82 1591.48 1725.16 1697.14 1592.19C1809.45 1451.25 1851.12 1285.28 1831.06 1107.72C1870.11 1014.49 1911.09 922.083 1953.98 830.552Z"/>
          <path fill="currentColor" className="text-primary" d="M1189.68 932.243C1336.78 926.002 1461.17 1040.02 1467.73 1187.1C1474.29 1334.19 1360.55 1458.83 1213.48 1465.71C1065.95 1472.61 940.849 1358.43 934.269 1210.9C927.689 1063.36 1042.13 938.504 1189.68 932.243Z"/>
        </svg>
      </div>
      {showText && (
        <span className="font-heading font-black text-xl tracking-tight text-primary">
          ILYRIUM
        </span>
      )}
    </div>
  );
}
