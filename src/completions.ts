import { CompletionItemProvider, CancellationToken, TextDocument, Position, CompletionContext, CompletionItem, CompletionItemKind, SnippetString, MarkdownString } from 'vscode';
import docs from './docs';

export default class Completions implements CompletionItemProvider
{
	public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): CompletionItem[] {
		let completionItems: CompletionItem[] = [];
	
		const { classes, functions, variables, keywords } = docs(document);

		for (let item of classes) {
			let completionItem = new CompletionItem(item.name, CompletionItemKind.Class);
			completionItem.detail = item.detail;
			completionItem.documentation = new MarkdownString(item.documentation);
			completionItem.insertText = new SnippetString(item.value);
			completionItems.push(completionItem);
		}

		for (let item of functions) {
			let completionItem = new CompletionItem(item.name, CompletionItemKind.Function);
			completionItem.detail = item.detail;
			completionItem.documentation = new MarkdownString(item.documentation);
			completionItem.insertText = new SnippetString(item.value);
			completionItems.push(completionItem);
		}

		for (let item of variables) {
			let completionItem = new CompletionItem(item.name, CompletionItemKind.Variable);
			completionItem.detail = item.detail;
			completionItem.documentation = new MarkdownString(item.documentation);
			completionItems.push(completionItem);
		}

		for (let item of keywords) {
			let completionItem = new CompletionItem(item.name, CompletionItemKind.Keyword);
			completionItem.detail = item.detail;
			completionItem.documentation = new MarkdownString(item.documentation);
			completionItems.push(completionItem);
		}

		return completionItems;
	}
}