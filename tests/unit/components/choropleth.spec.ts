import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import { mockPinia } from "../mocks/mockPinia";
import Choropleth from "../../../src/components/Choropleth.vue";
import { mockVuetify } from "../mocks/mockVuetify";

const store = mockPinia();
const renderComponent = () => {
    return render(Choropleth, {
        global: {
            plugins: [store, mockVuetify]
        }
    });
};

describe("Choropleth", () => {
    test("renders as expected", async () => {
        const comp = renderComponent();
        const map = (comp.baseElement as any).children[0].children[0].children[0];
        expect(map.children.length).toBe(5);
        const tileLayer = map.children[0];
        expect(tileLayer.tagName).toBe("L-TILE-LAYER-STUB");
        expect(tileLayer.getAttribute("maxzoom")).toBe("10");
        expect(tileLayer.getAttribute("minzoom")).toBe("3");
        expect(tileLayer.getAttribute("attribution")).toContain("Esri");
    });
});
