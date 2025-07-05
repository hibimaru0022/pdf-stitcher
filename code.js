"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 360, height: 400 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'request-frames') {
        const selection = figma.currentPage.selection;
        const frames = selection.filter(node => node.type === 'FRAME');
        if (frames.length === 0) {
            figma.ui.postMessage({ type: 'error', message: 'フレームを選択してください。' });
            return;
        }
        const frameInfos = yield Promise.all(frames.map((frame) => __awaiter(void 0, void 0, void 0, function* () {
            const bytes = yield frame.exportAsync({ format: 'PNG' }); // 高解像度のまま出力
            const base64 = figma.base64Encode(bytes);
            return {
                id: frame.id,
                name: frame.name,
                width: frame.width,
                height: frame.height,
                thumbnail: `data:image/png;base64,${base64}`,
                dataUrl: `data:image/png;base64,${base64}` // also used for PDF embed
            };
        })));
        figma.ui.postMessage({ type: 'frames-list', frames: frameInfos });
    }
    else if (msg.type === 'close') {
        figma.closePlugin();
    }
});
