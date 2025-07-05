figma.showUI(__html__, { width: 360, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'request-frames') {
    const selection = figma.currentPage.selection;
    const frames = selection.filter(node => node.type === 'FRAME') as FrameNode[];

    if (frames.length === 0) {
      figma.ui.postMessage({ type: 'error', message: 'フレームを選択してください。' });
      return;
    }

    const frameInfos = await Promise.all(
      frames.map(async (frame) => {
        const bytes = await frame.exportAsync({ format: 'PNG' }); // 高解像度のまま出力
        const base64 = figma.base64Encode(bytes);
        return {
          id: frame.id,
          name: frame.name,
          width: frame.width,
          height: frame.height,
          thumbnail: `data:image/png;base64,${base64}`,
          dataUrl: `data:image/png;base64,${base64}` // also used for PDF embed
        };
      })
    );

    figma.ui.postMessage({ type: 'frames-list', frames: frameInfos });
  } else if (msg.type === 'close') {
    figma.closePlugin();
  }
};