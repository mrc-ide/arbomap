import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { mockMapSettings, mockPinia } from "../../mocks/mockPinia";
import CountrySelector from "../../../../src/components/mapSettingsMenu/CountrySelector.vue";
import { mockRouter } from "../../mocks/mockRouter";
import { mockVuetify } from "../../mocks/mockVuetify";

const router = mockRouter();

const renderComponent = (country) => {
    const store = mockPinia({
        mapSettings: mockMapSettings({ country })
    });
    return render(CountrySelector, {
        global: {
            plugins: [store, mockVuetify, router]
        }
    });
};

describe("CountrySelector", () => {
    test("renders as expected on the global view", async () => {
        const { findByText } = renderComponent("");
        expect(await findByText("Global")).toBeVisible();
    });

    test("renders as expected on country view", async () => {
        const { findByText } = renderComponent("MWI");
        expect(await findByText("Malawi")).toBeVisible();
    });

    test("items appear when click input, and it can filter options on user input", async () => {
        await renderComponent("");
        const user = userEvent.setup();
        const globalListItem = await screen.findByText("Global");
        expect(globalListItem).toBeVisible();
        // Verify that it's the currently selected item
        expect((globalListItem as HTMLElement).className).toContain("v-autocomplete__selection-text");
        expect(await screen.queryByText("Malawi")).toBeNull();
        await user.click(globalListItem);
        const mwiListItem = await screen.findByText("Malawi");
        expect(mwiListItem).toBeVisible();
        expect((mwiListItem as HTMLElement).className).toContain("v-list-item-title");

        const input = await screen.findByPlaceholderText("Start typing to find a country");
        user.click(input);
        await user.type(input, "Tan");
        const tnzListItem = await screen.findByText("Tanzania");
        expect(tnzListItem).toBeVisible();
        expect((tnzListItem as HTMLElement).className).toContain("v-list-item-title");

        await waitFor(() => expect(screen.queryByText("Malawi")).toBe(null));
    });
});