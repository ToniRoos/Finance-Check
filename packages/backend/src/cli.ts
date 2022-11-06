#!/usr/bin/env node

import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { main } from "./";
import { resolve } from 'path';

const optionDefinitions: OptionDefinition[] = [
    { name: 'dataPath', type: String, defaultValue: resolve(__dirname, '..', 'data') },
]

async function cli() {
    const { dataPath } = commandLineArgs(optionDefinitions)
    main({ dataPath })
}

cli()