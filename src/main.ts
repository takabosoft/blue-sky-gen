/**
 * Build: npx webpack -w
 * Release Build: npx webpack --mode=production -w
 * Server: npx live-server docs
 */

import { ChangelogSection } from "./changelogSection";
import { PreviewSection } from "./previewSection";
import { ReadmeSection } from "./readmeSections";
import { RenderSection } from "./renderSection";

$(() => new PageController());

class PageController {
    constructor() {
        const previewSection = new PreviewSection();
        const renderSection = new RenderSection(() => renderSection.render(previewSection));

        $(document.body).append(
            $(`<main>`).append(
                new ReadmeSection().element,
                previewSection.element,
                renderSection.element,
                new ChangelogSection().element,
            ),
            $(`<footer>`).html(`青空ジェネレーター Copyright (C) 2025 <a href="https://takabosoft.com/" target="_blank">Takabo Soft</a>`),
        );
    }
}
