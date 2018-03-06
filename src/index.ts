import path from 'path';

import Markuplint from './core';
import CustomRule from './rule/custom-rule';

import { VerifiedResult } from './rule';
import ruleModulesLoader from './rule/loader';

import messenger from './locale/messenger/node';

import Ruleset from './ruleset';
import { ConfigureFileJSON } from './ruleset/JSONInterface';
import createRuleset from './ruleset/createRuleset';

import readTextFile from './util/readTextFile';

export async function verify (html: string, config: ConfigureFileJSON, rules: CustomRule[], locale?: string) {
	const ruleset = await createRuleset(config, rules);
	const core = new Markuplint(html, ruleset, await messenger(locale));
	return await core.verify();
}

export async function fix (html: string, config: ConfigureFileJSON, rules: CustomRule[], locale?: string) {
	const ruleset = await createRuleset(config, rules);
	const core = new Markuplint(html, ruleset, await messenger(locale));
	return await core.fix();
}

export async function verifyOnWorkspace (html: string, workspace?: string) {
	workspace = workspace ? workspace : process.cwd();
	const rules = await ruleModulesLoader();
	const ruleset = await createRuleset(workspace, rules);
	const core = new Markuplint(html, ruleset, await messenger());
	return await core.verify();
}

export async function verifyFile (filePath: string, rules?: CustomRule[], configFileOrDir?: string, locale?: string) {
	rules = rules || await ruleModulesLoader();
	let ruleset: Ruleset;
	if (configFileOrDir) {
		ruleset = await createRuleset(configFileOrDir, rules);
	} else {
		const absFilePath = path.resolve(filePath);
		const parsedPath = path.parse(absFilePath);
		const dir = path.dirname(absFilePath);
		ruleset = await createRuleset(dir, rules);
	}
	const html = await readTextFile(filePath);
	const core = new Markuplint(html, ruleset, await messenger(locale));
	const reports = await core.verify();
	return {
		html,
		reports,
	};
}
