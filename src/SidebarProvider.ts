import * as vscode from "vscode";
import snippets = require('./icons.json');
declare const window: any, document: any, acquireVsCodeApi: any;

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
              <title>SVG Icons</title>
              <style>
              .icon-name {
                  font-size: 1.1rem;
                  margin-bottom: 0px;
              }
              .icon {
                  padding: 2px 6px;
                  font-size: 1.6rem;
              }
              .hidden {
                  display: none;
              }
              input {
                  width: 90%;
                  font-size: 1.2rem;
                  margin: 3px 0;
                  padding: 3px 6px;
                  font-family: "Arial";
                  outline: 0;
                  border-radius: 3px;
                  border: 2px solid rgba(40,40,40,0.7);
              }
              body.vscode-dark input {
                  background: rgba(0,0,0,0.1);
                  color: rgba(255,255,255,0.8);
              }
              body.vscode-light input {
                  background: rgba(0,0,0,0.1);
                  color: rgba(0,0,0,0.8);
              }
              th {
                  font-size: 0.8rem;
                  text-align:center;
              }
              input:focus {
                  outline: 0;
              }
              tr {
                  margin: 20px 4px;
              }
              .results {
                  overflow:scroll;
                  max-height: 90vh;
              }
              button {
                width: 100%;
              }
              </style>
          </head>
          <body>
              <h1>SVG Icons</h1>
              <input oninput="handleInputChange(this.value)" placeholder="Search" type="text"/>
              <div class="results">
              <table>
              <thead>
                  <tr>
                  <th>Icon</th>
                  <th>Icon name</th>
                  </tr>
              </thead>
                  <tbody>
                  ${Object.keys(snippets)
                    .map((icon:any) => {
                      const name:string = icon;
                      return ` <tr data-icon-name="${name}" >
                                  <td class="icon">
                                    <i class="bi bi-${name}"></i>
                                  </td>
                                  <td class="icon-name">
                                      <button onclick="addSnippet('${name}')">${name}</button>
                                  </td>
                                </tr>`;
                    })
                    .join("")}
              </tbody>
  </table>
  </div>
  <script>
  function handleInputChange(searchTerm){
    document.querySelectorAll("tr").forEach(element => {
      var iconName = element.getAttribute("data-icon-name");
      if (iconName){
        if (searchTerm == ""){
          element.classList.remove("hidden");
        } else if (iconName.includes(searchTerm) ){
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      }
    });
  }
  function addSnippet(name){
    const vscode = acquireVsCodeApi();
    vscode.window.showInformationMessage('Not Working Yet -.-');
    const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            editor.edit(editBuilder => {
                editor.selections.forEach(sel => {
                const position = editor.selection.active;
                editBuilder.insert(position, 'text');
              })
            })
        }
  }
  (function(){
    document.querySelector('input').focus();
  })()

  </script>
</body>
</html>`;
  }
}