import { Class } from 'meteor/jagi:astronomy';
import _contains from 'lodash/contains';
import { resetAsync } from '../utils';
import {Mongo} from 'meteor/mongo';

Tinytest.add('Behaviors - Slug Async', async function(test) {
  // Reset Astronomy.
  resetAsync();

  var SlugsA = new Mongo.Collection(null);
  var SlugsB = new Mongo.Collection(null);

	const docsA = await SlugsA.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsA.map(async function (slug) {
    await SlugsA.removeAsync(slug._id);
  }));

  const docsB = await SlugsB.findFetchAsync({}, {
		transform: null
	});
	await Promise.all(docsB.map(async function (slug) {
    await SlugsB.removeAsync(slug._id);
  }));

  var SlugA = Class.create({
    name: 'SlugA',
    collection: SlugsA,
    fields: {
      name: 'string'
    },
    behaviors: {
      slug: {}
    }
  });

  var SlugB = Class.create({
    name: 'SlugB',
    collection: SlugsB,
    fields: {
      title: 'string'
    },
    behaviors: {
      slug: {
        fieldName: 'title',
        slugFieldName: 'slugged',
        canUpdate: true,
        unique: false,
        separator: '_'
      }
    }
  });

  var diacritics = 'ąáàâãăåäāǟ' + 'ćĉčçċ' + 'ďđḑ' + 'ęéèêěĕëēė' + 'ģĝğġģ' +
    'ĥħ' + 'íìîĭïīįĩı' + 'ĵ' + 'ķ' + 'łļĺľŀ' + 'ňńņñŉ' + 'óòôŏöōøőȯȱȭõ' +
    'řŗŕ' + 'śŝšş' + 'ťțŧ' + 'úùûūųüűŭũů' + 'ŵ' + 'ŷýÿ' + 'źżž' +
    'абчдеёэфгийяъюкхлмнопрсшщтцувызж';
  var expected = 'aaaaaaaaaa' + 'ccccc' + 'ddd' + 'eeeeeeeee' + 'ggggg' +
    'hh' + 'iiiiiiiii' + 'j' + 'k' + 'lllll' + 'nnnnn' + 'oooooooooooo' +
    'rrr' + 'ssss' + 'ttt' + 'uuuuuuuuuu' + 'w' + 'yyy' + 'zzz' +
    'abchdeeefgiiiaieiukkhlmnoprsshshchttsuvyzzh';

  var slugA1 = new SlugA();
  slugA1.set('name', 'Slug ' + diacritics);
  await slugA1.saveAsync();
  test.equal(slugA1.get('slug'), 'slug-' + expected,
    'The slug function does not work properly'
  );

  var slugA2 = new SlugA();
  slugA2.set('name', 'Slug ' + diacritics);
  await slugA2.saveAsync();
  test.equal(slugA2.get('slug'), 'slug-' + expected + '-2',
    'The value of the slag field should be unique'
  );

  slugA1.set('name', 'Slug2 ' + diacritics);
  await slugA1.saveAsync();
  test.equal(slugA1.get('slug'), 'slug-' + expected,
    'It should not be possible to update a slug'
  );

  var slugB1 = new SlugB();
  slugB1.set('title', 'Slug ' + diacritics);
  await slugB1.saveAsync();
  test.isNotUndefined(slugB1.get('slugged'),
    'The name of a field for the slug storage should be "slugged"'
  );
  test.isTrue(typeof slugB1.get('slugged') === 'string',
    'The slug should be created from the value of the "title" field'
  );
  test.isTrue(_contains(slugB1.get('slugged'), '_'),
    'The prefix character should be "_"'
  );

  slugB1.set('title', 'Slug2 ' + diacritics);
  await slugB1.saveAsync();
  test.equal(slugB1.get('slugged'), 'slug2_' + expected,
    'It should be possible to update a slug"'
  );

  const slugB2 = new SlugB();
  slugB2.set('title', 'Slug2 ' + diacritics);
  await slugB2.saveAsync();
  test.equal(slugB2.get('slugged'), 'slug2_' + expected,
    'The value of the slag field should not be unique'
  );
});
