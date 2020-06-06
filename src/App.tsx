/** @jsx jsx */
import { jsx, css, Global } from "@emotion/core";
import styled from "@emotion/styled";
import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import TurndownService from "turndown";
import ReactMarkdown from "react-markdown";
import AceEditor from "react-ace";
import Button from "@material-ui/core/Button";
import "ace-builds/src-noconflict/theme-github";

const MOBILE_BREAKPOINT = "1520px";

/**
 * A function to convert markdown to HTML
 */
function convertHtmltoMd(htmlString: string): string {
  const turndown = new TurndownService();

  const markdownString = turndown.turndown(htmlString);
  return markdownString;
}

/**
 * Download string as a file
 */
function downloadString(text: string, filename: string): void {
  const element = document.createElement("a");
  element.setAttribute("download", filename);

  const data = new Blob([text], { type: "text/plain" });
  const url = window.URL.createObjectURL(data);

  element.setAttribute("href", url);
  element.click();
}

const TEXT_COLOR = "#1a85b9";

const H1 = styled.h1`
  font-family: "Coustard", serif;
  font-size: 3rem;
  color: ${TEXT_COLOR};
`;

/**
 * A customised MUI button
 */
interface MyButtonProps {
  onClick: (event: any) => void;
  children?: any;
}
const MyButton: React.FC<MyButtonProps> = (props) => {
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={props.onClick}
      style={{
        marginBottom: "10px",
        backgroundColor: TEXT_COLOR,
      }}
    >
      {props.children}
    </Button>
  );
};

// const Button = styled.button`
//   background-color: black;
//   color: white;
//   border: none;
//   padding: 5px 10px;
//   border-radius: 2px;
// `;

function App() {
  /**
   * The current markdown output
   */
  const [markdownString, setMarkdownString] = useState<string | null>(null);
  const [htmlString, setHtmlString] = useState<string | null>(null);
  const [previewMarkdown, setPreviewMarkdown] = useState<boolean>(false);

  return (
    <div className="App">
      <Global
        styles={css`
          body {
            background: #d4f3ff ;
            box-sizing: border-box;
            padding: 0 30px;
          }
        `}
      />
      <div
        className="content-wrapper"
        css={css`
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
        `}
      >
        <header
          css={css`
            margin-top: 50px;
            margin-bottom: 50px;
          `}
        >
          <H1>Convert your HTML into Markdown</H1>
        </header>
        <div
          className="text-area-wrapper"
          css={css`
            justify-content: center;
            display: flex;
          `}
        >
          {/* HTML Text area */}

          <div
            css={css`
              display: flex;
              flex-direction: row;

              flex-wrap: wrap;

              @media (max-width: ${MOBILE_BREAKPOINT}) {
                flex-direction: column;
              }
            `}
          >
            <AceEditor
              style={{
                border: "1px solid #9f9f9f",
              }}
              fontSize="18px"
              className="github"
              value={htmlString ?? undefined}
              onChange={(change) => {
                const markdown = convertHtmltoMd(change);
                setMarkdownString(markdown);
                setHtmlString(change);
              }}
              name="html-textarea"
              editorProps={{ $blockScrolling: true }}
            />

            <div
              css={css`
                display: flex;
                flex-direction: column;
                margin: 20px 30px;
              `}
            >
              <MyButton
                onClick={(e) => {
                  console.log(previewMarkdown);
                  setPreviewMarkdown(!previewMarkdown);
                }}
              >
                Show {previewMarkdown ? "Raw" : "Rich Markdown"}
              </MyButton>
              <MyButton
                onClick={() => {
                  if (markdownString) {
                    downloadString(markdownString, "markdown.md");
                  }
                }}
              >
                Download text as .md file
              </MyButton>
            </div>

            {/* MD Text area */}

            <div
              css={css`
                width: 500px;
              `}
            >
              {!previewMarkdown && (
                <AceEditor
                  style={{
                    border: "1px solid #9f9f9f",
                  }}
                  fontSize="18px"
                  className="github"
                  name="md-textarea"
                  editorProps={{ $blockScrolling: true }}
                  value={markdownString ?? undefined}
                />
              )}

              {previewMarkdown && (
                <ReactMarkdown source={markdownString ?? undefined} />
              )}
            </div>
          </div>
        </div>

        <div id="error-box"></div>
      </div>
      <footer
        css={css`
          * {
            color: #004c71;
          }
        `}
      >
        <p>
          This website was created by{" "}
          <a href="https://github.com/Robbie-Cook" target="_blank">
            Robbie Cook
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/kcuhcx2
"
          >
            Michael Seibt
          </a>
          . Please send any feedback to{" "}
          <a href="mailto:robbie@robbie.pw" target="_blank">
            robbie@robbie.pw
          </a>
          , and consider opening an issue{" "}
          <a href="https://github.com/Robbie-Cook/markdown-converter/issues">
            here
          </a>
          .
        </p>
        <p><a href="https://github.com/Robbie-Cook/markdown-converter">GitHub link</a></p>
      </footer>
    </div>
  );
}

export default App;
