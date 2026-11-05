import { describe, expect, it } from "vitest";
import { LIVE_TEMPS_PANEL_TEXT_EN, makeFormat } from "./LiveTempsPanel";

describe("Live tile temperatures follow the °C preference", () => {
  it("keeps °F as the tile value by default, °C underneath", () => {
    const f = makeFormat(LIVE_TEMPS_PANEL_TEXT_EN, undefined);
    expect(f.tempMain(34, 1.1)).toBe("34.0°F");
    expect(f.tempDetail(34, 1.1, 61.6)).toBe("1.1°C · 62% humidity");
    expect(f.tempOther(34, 1.1)).toBe("1.1°C");
    expect(f.tempFromF(34)).toBe("34.0°F");
  });

  it("swaps to °C first with °F underneath", () => {
    const f = makeFormat(LIVE_TEMPS_PANEL_TEXT_EN, undefined, true);
    expect(f.tempMain(34, 1.1)).toBe("1.1°C");
    expect(f.tempDetail(34, 1.1, 61.6)).toBe("34.0°F · 62% humidity");
    expect(f.tempOther(34, 1.1)).toBe("34.0°F");
    // A bare stored °F value converts as a temperature (with the 32° offset).
    expect(f.tempFromF(34)).toBe("1.1°C");
  });

  it("shows a dash for a missing value instead of a fake zero", () => {
    const f = makeFormat(LIVE_TEMPS_PANEL_TEXT_EN, undefined, true);
    expect(f.tempMain(34, null)).toBe("—");
    // As before for the °C line: the unit stays, the number is a dash.
    expect(f.tempDetail(null, 1.1, null)).toBe("—°F · —% humidity");
  });

  it("uses locale digits and the translated line", () => {
    const f = makeFormat({ ...LIVE_TEMPS_PANEL_TEXT_EN, tempHumidity: "{temp} {unit} · {humidity} % Luftfeuchte" }, "de-DE", true);
    expect(f.tempMain(34, 1.1)).toBe("1,1°C");
    expect(f.tempDetail(34, 1.1, 50)).toBe("34,0 °F · 50 % Luftfeuchte");
  });
});
