export interface MLToken {
	uuid: string;
	raw: string;
	startOffset: number;
	endOffset: number;
	startLine: number;
	endLine: number;
	startCol: number;
	endCol: number;
}

export enum MLASTNodeType {
	Doctype = 'doctype',
	StartTag = 'starttag',
	EndTag = 'endtag',
	Comment = 'comment',
	Text = 'text',
	OmittedTag = 'omittedtag',
	PreprocessorSpecificBlock = 'psblock',
}

export type MLASTNode = MLASTDoctype | MLASTTag | MLASTComment | MLASTText | MLASTPreprocessorSpecificBlock;

export interface MLASTAbstructNode extends MLToken {
	type: MLASTNodeType;
	nodeName: string;
	parentNode: MLASTParentNode | null;
	prevNode: MLASTNode | null;
	nextNode: MLASTNode | null;
	isFragment: boolean;
	isGhost: boolean;
}

export interface MLASTDoctype extends MLASTAbstructNode {
	type: MLASTNodeType.Doctype;
	name: string;
	publicId: string;
	systemId: string;
}

export interface MLASTElement extends MLASTAbstructNode {
	type: MLASTNodeType.StartTag;
	namespace: string;
	attributes: MLASTAttr[];
	childNodes?: MLASTNode[];
	pearNode: MLASTElementCloseTag | null;
	selfClosingSolidus: MLToken;
	endSpace: MLToken;
	tagOpenChar: string;
	tagCloseChar: string;
}

export interface MLASTElementCloseTag extends MLASTAbstructNode {
	type: MLASTNodeType.EndTag;
	namespace: string;
	attributes: MLASTAttr[];
	childNodes?: MLASTNode[];
	pearNode: MLASTTag | null;
	tagOpenChar: string;
	tagCloseChar: string;
}

export interface MLASTOmittedElement extends MLASTAbstructNode {
	type: MLASTNodeType.OmittedTag;
	namespace: string;
	childNodes?: MLASTNode[];
}

export interface MLASTPreprocessorSpecificBlock extends MLASTAbstructNode {
	type: MLASTNodeType.PreprocessorSpecificBlock;
	nodeName: string;
	parentNode: MLASTParentNode | null;
	prevNode: MLASTNode | null;
	nextNode: MLASTNode | null;
	childNodes?: MLASTNode[];
	branchedChildNodes?: MLASTNode[];
}

export type MLASTTag = MLASTElement | MLASTElementCloseTag | MLASTOmittedElement;

export type MLASTParentNode = MLASTElement | MLASTOmittedElement | MLASTPreprocessorSpecificBlock;

export interface MLASTComment extends MLASTAbstructNode {
	type: MLASTNodeType.Comment;
}

export interface MLASTText extends MLASTAbstructNode {
	type: MLASTNodeType.Text;
}

export type MLASTAttr = MLASTHTMLAttr | MLASTPreprocessorSpecificAttr;

export interface MLASTHTMLAttr extends MLToken {
	type: 'html-attr';
	spacesBeforeName: MLToken;
	name: MLToken;
	spacesBeforeEqual: MLToken;
	equal: MLToken;
	spacesAfterEqual: MLToken;
	startQuote: MLToken;
	value: MLToken;
	endQuote: MLToken;
	isInvalid: boolean;
	isDynamicValue?: true;
	isDirective?: true;
	potentialName?: string;
}

export interface MLASTPreprocessorSpecificAttr extends MLToken {
	type: 'ps-attr';
	potentialName: string;
	potentialValue: string;
	valueType: 'string' | 'number' | 'boolean' | 'code';
	isDuplicatable: boolean;
}

export interface MLASTDocument {
	nodeList: MLASTNode[];
	isFragment: boolean;
	parseError?: string;
}

export interface MLMarkupLanguageParser {
	parse(sourceCode: string): MLASTDocument;
}

export type Parse = (
	rawCode: string,
	offsetOffset?: number,
	offsetLine?: number,
	offsetColumn?: number,
) => MLASTDocument;

export type Walker = (node: MLASTNode, depth: number) => void;
