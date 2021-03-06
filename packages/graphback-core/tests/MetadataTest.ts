//tslint:disable-next-line: match-default-export-name no-implicit-dependencies
import { readFileSync } from 'fs';
import { buildSchema } from 'graphql';
import { GraphbackCoreMetadata } from '../src'
import { existedOperationTypeMessage } from 'graphql/validation/rules/UniqueOperationTypes';

const schemaText = readFileSync(`${__dirname}/mock.graphql`, 'utf8')

test('Test metadata', async () => {

  const crudMethods = {
    "create": true,
    "update": true,
    "findAll": true,
    "find": false,
    "delete": true,
  }

  let metadata = new GraphbackCoreMetadata({ crudMethods: {} }, buildSchema(schemaText))
  metadata = new GraphbackCoreMetadata({ crudMethods }, buildSchema(schemaText))
  const models = metadata.getModelDefinitions();
  const crudModels = models.map((model: any) => {
    expect(model.crudOptions.findAll).toEqual(true);
    expect(model.crudOptions.find).toEqual(false);

    return model.crudOptions;
  })

  expect(models[0].crudOptions.delete).toEqual(false)
  expect(models[1].crudOptions.create).toEqual(false)
  expect(models[1].crudOptions.delete).toEqual(true)
  expect(crudModels).toMatchSnapshot()
});
