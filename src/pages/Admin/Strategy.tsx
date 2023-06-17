import React, { useEffect, useState } from "react";
import { Button } from 'antd';
import { chart, strategy } from '@/api';
import Prism from 'prismjs';
import 'prismjs/themes/prism.min.css';
import 'prismjs/components/prism-javascript.min.js';
import { CodeJar } from "codejar";
import styles from './index.less';

const highlight = (editor: HTMLElement) => {
  const code = editor.textContent || '';
  // Do something with code and set html.
  editor.innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript');
}

const Strategy = () => {

  const [loading, setLoading] = useState(true);
  const jarRef = React.useRef<CodeJar>();
  useEffect(() => {
    const editor = document.getElementById('editor');
    if (editor) {
      jarRef.current = CodeJar(editor, highlight, {tab: '\t'});
      getCode();
    }

  }, []);

  const getCode = async () => {
    setLoading(true);
    const code = await strategy.getStrategyFunction();
    jarRef.current?.updateCode(code);
    setLoading(false);
  }
  const save = async () => {
    setLoading(true);
    await strategy.updateStrategyFunction(jarRef.current?.toString() || '');
    await getCode();
    setLoading(false);
  }
  return (
    <div className={styles.strategy}>
      <Button type="primary" onClick={save} size="small" loading={loading}>
        Save
      </Button>
      <div className={styles.editor} id="editor" />
    </div>
  );
};
export default Strategy;