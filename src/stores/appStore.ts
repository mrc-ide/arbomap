import { defineStore } from "pinia";
import { getAppConfig, getGeojson, getIndicators } from "../resources/utils";
import { AppConfig, CountryGeojson, CountryIndicators, CountryLevelIndicators, Geojson } from "../resourceTypes";
import { Ref, ref } from "vue";
import {FeatureGeojson, FeatureIndicators} from "../types";
import {Feature} from "geojson";

export const useAppStore = defineStore('app', {
    state: () => {
        const loading = true;
        const selectedIndicator = "";

        // When a country is selected, we display admin2 data for it.
        // We display admin1 data for all other countries
        const selectedCountryId = "";

        const appConfig: AppConfig | null = null;

        // We keep all data in dictionaries with country ids as keys, mirroring the resources on disk
        const admin1Indicators: Dict<FeatureIndicators> = {};
        const admin1Geojson: Dict<FeatureGeojson> = {};
        const admin2Indicators: Dict<FeatureIndicators> = {};
        const admin2Geojson: Dict<FeatureGeojson> = {};

        return {
            loading,
            appConfig,
            selectedCountryId,
            selectedIndicator,
            admin1Indicators,
            admin1Geojson,
            admin2Indicators,
            admin2Geojson
        }
    },
    getters: {
        selectedIndicators: (state): FeatureIndicators  => {
            const { selectedCountryId, admin1Indicators, admin2Indicators } = state;
            // get single dictionary of feature id to indicator values for user selections
            if (!selectedCountryId) {
                return Object.assign({}, ...Object.values(admin1Indicators));
            }

            // Return admin1 indicators for countries other than the selected country, and
            // admin2 indicators for the selected country
            // NB we could return all indicators and look up values from features for the purposes of the map, but it will be
            // useful to directly access all selected indicators when exporting data
            const filteredAdmin1 = Object.entries(admin1Indicators)
                .filter(([countryId, indicators]) => countryId !== selectedCountryId)
                .map(([countryId, indicators]) => indicators);

            return Object.assign({}, admin2Indicators[selectedCountryId], ...filteredAdmin1);
        },
        selectedFeatures: (state): Feature[] => {
            const { selectedCountryId, admin1Geojson, admin2Geojson } = state;
            // get single array of all selected features
            if (!selectedCountryId) {
                return Object.values(admin1Geojson).flatMap((geojson) => geojson.features);
            }

            const filteredAdmin1 = Object.entries(admin1Geojson)
              .filter(([countryId, indicators]) => countryId != selectedCountryId)
              .flatMap(([countryId, geojson]) => geojson.features);

            return [...admin2Geojson.features, ...filteredAdmin1]
        }
    },
    actions: {
        async initialiseData() {
            this.appConfig = await getAppConfig();
            const allIndicators = {};
            const allGeojson = {};
            const level = 1;

            // Load all admin1 level data
            for (const country of this.appConfig.countries) {
                allIndicators[country] = await getIndicators(country, level);
                allGeojson[country] = await getGeojson(country, level);
            }

          this.selectedIndicator = Object.keys(this.appConfig.indicators)[0];

          Object.assign(this.admin1Indicators, allIndicators);
          Object.assign(this.admin1Geojson, allGeojson);





          // KEEP THIS
          this.loading = false;
      },
      async genData() {
          this.loading = true;

        // TODO: remove this - generate admin2 indicators
        const countries = ["MWI", "TZI"];
        for(const country of countries) {
          console.log("generating for " + country)
          const geo = await getGeojson(country, 2);
          const features = geo.features as Feature[];
          const data = {};
          const rnd = (min, max) => ( Math.random() * (max - min) ) + min;
          features.forEach((f: Feature) => {
            const id = f.properties.shapeID;

            //FOI between 0.01 and 0.03
            const foi_mean = rnd(0.01, 0.03);
            //sd between 0.001 and 0.006
            const foi_sd = rnd(0.001, 0.006);
            // 9dp

            //p9 between 40 and 70
            const p9_mean = rnd(40, 70);
            //sd between 3 and 10
            const p9_sd = rnd(3, 10);
            // 9dp

            data[id] = {
              FOI: {
                mean: foi_mean,
                sd: foi_sd
              },
              p9: {
                mean: p9_mean,
                sd: p9_sd
              }
            };

          });

          console.log("writing for " + country)
          var blob = new Blob([JSON.stringify(data, null, 4)], {type: "application/json"});
          var a = document.createElement('a');
          a.href = window.URL.createObjectURL(blob);
          a.download = `indicators-${country}-ADM2.json`;
          a.click();
        } // for each country
        // TODO: make this an action...

        // TODO: admin 1 indicators - using shapeID, and update Choro code




        this.loading = false;
      }
    }
})
