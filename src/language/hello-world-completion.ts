import { DefaultCompletionProvider, LangiumDocument } from 'langium';
import {
  CompletionList,
  CompletionItemKind,
  CompletionParams,
  CompletionItem,
  InsertTextFormat
} from 'vscode-languageserver';

type Suggestions = Promise<CompletionList | undefined>;


export class HelloWorldCompletionProvider extends DefaultCompletionProvider {
  override async getCompletion(doc: LangiumDocument, params: CompletionParams): Suggestions {
    const list = await super.getCompletion(doc, params);
    if (list !== undefined) {
      const snippets: CompletionItem[]  = [
        {
          label: 'person',
          kind: CompletionItemKind.Snippet,
          insertText: 'person ${1:name}',
          documentation: 'Define a new person',
          insertTextFormat: InsertTextFormat.Snippet
        },
        {
          label: 'hello',
          kind: CompletionItemKind.Snippet,
          insertText: 'hello ${1:person}',
          documentation: 'Define a new greeting',
          insertTextFormat: InsertTextFormat.Snippet
        }
      ]; 

      list.items.push(...snippets);
    } 

    return list;
  }
}


