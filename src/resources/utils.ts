import {AppConfig, Geojson, FeatureIndicators, BoundingBox} from "../types/resourceTypes";
import { APP_BASE_URL } from "../router/utils";
import {Feature, FeatureCollection} from "geojson";
import {Dict} from "../types/utilTypes";

const getResource = async (path: string) => {
    const location = `${APP_BASE_URL}/resources/${path}`;
    console.log(`Reading from ${location}`)
    const res = await fetch(location);
    return res.json();
};

export const getAppConfig = async () => {
    return (await getResource("config.json")) as AppConfig;
};

export const getIndicators = async (country: string, level: number) => {
    return (await getResource(`indicators/admin${level}/${country}.json`)) as FeatureIndicators;
};

export const getGeojsonFeatures = async (country: string, level: number) => {
    const file = level === 1 ? `geojson/admin${level}/gadm41_${level}.json` : `geojson/admin${level}/gadm41_${country}_${level}_2_5pc.json`
    const coll = (await getResource(file)) as Geojson;
    return coll.features;
};

export const getGlobalGeojsonFeatures = async (level: number) => {
    return (await getResource(`geojson/all_adm${level}_0_5pc_by_iso.json`)) as FeatureCollection;
};

export const getGlobalIndicators = async (level: number) => {
    return (await getResource(`indicators/admin${level}/global_adm${level}.json`)) as Dict<FeatureIndicators
}

export const getCountryBoundingBoxes = async () => {
    return (await getResource(`geojson/adm0_bounds.json`)) as Dict<BoundingBox>;
};
