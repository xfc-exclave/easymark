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
import { slashPlugin, slash, createDropdownItem, defaultActions } from '@milkdown/plugin-slash';
import { menu } from '@milkdown/plugin-menu';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import { replaceAll } from '@milkdown/utils';
import { gfm, blockquote, paragraph, heading, codeFence, codeInline, orderedList, bulletList, SupportedKeys } from '@milkdown/preset-gfm';
import 'katex/dist/katex.min.css';
import './index.css'

export default function MilkEditor(props) {
  const {
    setWordCount
  } = props;

  const easyEditor = props.data.editorReducer.filter(item => item.key === props.editorId)[0]

  const gfmConfig = gfm.configure(blockquote, {
    keymap: {
      [SupportedKeys.Blockquote]: 'Mod-Shift-q'
    },
    className: () => 'easy-mark-blockquote',
  }).configure(paragraph, {
    keymap: {
      [SupportedKeys.Text]: 'Mod-0'
    },
  }).configure(heading, {
    keymap: {
      [SupportedKeys.H1]: 'Mod-1',
      [SupportedKeys.H2]: 'Mod-2',
      [SupportedKeys.H3]: 'Mod-3',
      [SupportedKeys.H4]: 'Mod-4',
      [SupportedKeys.H5]: 'Mod-5',
      [SupportedKeys.H6]: 'Mod-6'
    },
    className: (attrs) => `heading h${attrs.level} easy-mark-h${attrs.level}`,
  }).configure(codeFence, {
    keymap: {
      [SupportedKeys.CodeFence]: 'Mod-Shift-k',
    },
  }).configure(codeInline, {
    keymap: {
      [SupportedKeys.CodeInline]: 'Mod-Alt-k',
    },
    className: () => 'easy-mark-codeinline',
  }).configure(orderedList, {
    keymap: {
      [SupportedKeys.OrderedList]: 'Mod-Shift-[',
    },
  }).configure(bulletList, {
    keymap: {
      [SupportedKeys.BulletList]: 'Mod-Shift-]',
    },
  });

  const slashConfig = slash.configure(slashPlugin, {
    config: ctx => {
      const actions = defaultActions(ctx);
      return ({ isTopLevel, content }) => {
        if (!isTopLevel) return null;
        if (!content) {
          return { placeholder: 'Type / to insert...' };
        }
        if (content.startsWith('/')) {
          return content === '/'
            ? { placeholder: 'Please select...', actions }
            : { actions: actions.filter(({ keyword }) => keyword == null ? null : keyword.some(key => key.includes(content.slice(1).toLocaleLowerCase()))) };
        }
      };
    }
  })

  const { editor } = useEditor(
    root => Editor.make()
      .config(ctx => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, '');
        ctx.get(listenerCtx)
          .beforeMount((ctx) => {})
          .mounted(replaceAll(easyEditor.content))
          .updated((ctx, doc, prevDoc) => {})
          .markdownUpdated((_ctx, markdown) => {
            easyEditor.tempContent = markdown
            easyEditor.wordCount = markdown == null ? 0 :markdown.replaceAll(' ', '').length
            setWordCount(easyEditor.wordCount)
          })
          .blur((ctx) => {})
          .focus((ctx) => {})
          .destroy((ctx) => {});
      })
      .use(nord)
      .use(gfmConfig)
      .use(emoji)
      .use(tooltip)
      .use(slashConfig)
      .use(history)
      .use(clipboard)
      .use(math)
      .use(prism)
      .use(diagram)
      .use(menu)
      .use(listener),
    []);
  return (
    <div spellCheck={false}>
      <ReactEditor editor={editor} style={{ height: '100%' }} />
    </div>
  );
}
