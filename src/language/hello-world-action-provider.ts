import {
  AstNode,
  CodeActionProvider,
  LangiumDocument,
  MaybePromise,
} from "langium";
import {
  CodeActionParams,
  CancellationToken,
  Command,
  CodeAction,
  Diagnostic,
  CodeActionKind,
} from "vscode-languageserver";

import { IssueCodes } from "./hello-world-validator";

export class HelloWorldActionProvider implements CodeActionProvider {
  getCodeActions(
    document: LangiumDocument<AstNode>,
    params: CodeActionParams,
    cancelToken?: CancellationToken | undefined
  ): MaybePromise<(Command | CodeAction)[] | undefined> {
    const result: CodeAction[] = [];
    const acceptor = (ca: CodeAction | undefined) => ca && result.push(ca);
    for (const diagnostic of params.context.diagnostics) {
      this.createCodeActions(diagnostic, document, acceptor);
    }
    return result;
  }

  private createCodeActions(
    diagnostic: Diagnostic,
    document: LangiumDocument,
    accept: (ca: CodeAction | undefined) => void
  ): void {
    switch (diagnostic.code) {
      case IssueCodes.PersonNameUppercase:
        accept(this.makeUpperCase(diagnostic, document));
        break;
      //   case IssueCodes.XXXXXXX:
      //     accept(this.makeXXXXXX(diagnostic, document));
      //     break;
    }
    return undefined;
  }

  private makeUpperCase(
    diagnostic: Diagnostic,
    document: LangiumDocument
  ): CodeAction {
    const range = {
      start: diagnostic.range.start,
      end: {
        line: diagnostic.range.start.line,
        character: diagnostic.range.start.character + 1,
      },
    };
    return {
      title: "Upper case first letter",
      kind: CodeActionKind.QuickFix,
      diagnostics: [diagnostic],
      isPreferred: true,
      edit: {
        changes: {
          [document.textDocument.uri]: [
            {
              range,
              newText: document.textDocument.getText(range).toUpperCase(),
            },
          ],
        },
      },
    };
  }
}
