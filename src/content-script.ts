import { SearchEngineProvider } from "@shared/search-engine.provider";

const provider = new SearchEngineProvider();
const searchEngine = provider.create(window.location.hostname);
if (searchEngine) {
    searchEngine.addWidget();
}