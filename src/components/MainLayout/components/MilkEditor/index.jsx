import React from 'react';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { ReactEditor, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { emoji } from "@milkdown/plugin-emoji";
import { history } from "@milkdown/plugin-history";
import { clipboard } from "@milkdown/plugin-clipboard";
import { math } from "@milkdown/plugin-math";
import { prism } from "@milkdown/plugin-prism";
import { diagram } from "@milkdown/plugin-diagram";
import { tooltip } from "@milkdown/plugin-tooltip";
import { cursor } from "@milkdown/plugin-cursor";
import { indent } from "@milkdown/plugin-indent";
import { slash } from "@milkdown/plugin-slash";
import { menu } from '@milkdown/plugin-menu';
import { gfm, blockquote, SupportedKeys } from "@milkdown/preset-gfm";
import 'katex/dist/katex.min.css';
import './index.css'

export default function MilkEditor(props) {
  const nodes = gfm.configure(blockquote, {
  });

  const { editor } = useEditor(
    root => Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, props.content);
      })
      .use(nord)
      .use(commonmark)
      .use(emoji)
      .use(tooltip)
      .use(slash)
      .use(history)
      .use(clipboard)
      .use(math)
      .use(prism)
      .use(diagram)
      .use(indent)
      .use(cursor)
      .use(menu),
    []);
  return (
    <div>
      <ReactEditor editor={editor} style={{ height: '100%' }} />
    </div>
  );
}