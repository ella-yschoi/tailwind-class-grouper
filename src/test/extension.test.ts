import * as assert from 'assert';
import {
  stripVariants,
  getCategoryKey,
  groupClasses,
  transformAttribute,
  CategoryKey,
} from '../grouper';

// ---------- stripVariants ----------

function testStripVariants() {
  // Simple variant
  assert.strictEqual(stripVariants('hover:bg-blue-500'), 'bg-blue-500');
  // Multiple variants
  assert.strictEqual(stripVariants('md:dark:flex'), 'flex');
  // No variant
  assert.strictEqual(stripVariants('flex'), 'flex');
  // Arbitrary value with colons inside brackets preserved
  assert.strictEqual(stripVariants('bg-[url:something]'), 'bg-[url:something]');
  // Variant + arbitrary value
  assert.strictEqual(stripVariants('hover:bg-[#ff0000]'), 'bg-[#ff0000]');
  // Variant + arbitrary value with colons inside brackets
  assert.strictEqual(stripVariants('dark:bg-[url:test]'), 'bg-[url:test]');

  console.log('  stripVariants: all passed');
}

// ---------- getCategoryKey ----------

function testGetCategoryKey() {
  // Size
  assert.strictEqual(getCategoryKey('w-full'), 'size');
  assert.strictEqual(getCategoryKey('h-32'), 'size');
  assert.strictEqual(getCategoryKey('min-w-0'), 'size');
  assert.strictEqual(getCategoryKey('max-h-screen'), 'size');

  // Layout
  assert.strictEqual(getCategoryKey('flex'), 'layout');
  assert.strictEqual(getCategoryKey('grid'), 'layout');
  assert.strictEqual(getCategoryKey('block'), 'layout');
  assert.strictEqual(getCategoryKey('relative'), 'layout');
  assert.strictEqual(getCategoryKey('absolute'), 'layout');
  assert.strictEqual(getCategoryKey('items-center'), 'layout');
  assert.strictEqual(getCategoryKey('justify-between'), 'layout');

  // Spacing
  assert.strictEqual(getCategoryKey('p-4'), 'spacing');
  assert.strictEqual(getCategoryKey('px-2'), 'spacing');
  assert.strictEqual(getCategoryKey('mt-8'), 'spacing');
  assert.strictEqual(getCategoryKey('gap-4'), 'spacing');

  // Border
  assert.strictEqual(getCategoryKey('border'), 'border');
  assert.strictEqual(getCategoryKey('border-red-500'), 'border');
  assert.strictEqual(getCategoryKey('rounded-lg'), 'border');

  // Background
  assert.strictEqual(getCategoryKey('bg-blue-500'), 'background');
  assert.strictEqual(getCategoryKey('from-green-400'), 'background');
  assert.strictEqual(getCategoryKey('via-blue-500'), 'background');
  assert.strictEqual(getCategoryKey('to-purple-600'), 'background');

  // Text
  assert.strictEqual(getCategoryKey('text-white'), 'text');
  assert.strictEqual(getCategoryKey('font-bold'), 'text');
  assert.strictEqual(getCategoryKey('leading-tight'), 'text');
  assert.strictEqual(getCategoryKey('tracking-wide'), 'text');
  assert.strictEqual(getCategoryKey('uppercase'), 'text');
  assert.strictEqual(getCategoryKey('truncate'), 'text');

  // Effects
  assert.strictEqual(getCategoryKey('shadow-md'), 'effects');
  assert.strictEqual(getCategoryKey('transition'), 'effects');
  assert.strictEqual(getCategoryKey('duration-300'), 'effects');
  assert.strictEqual(getCategoryKey('animate-spin'), 'effects');

  // Interactivity
  assert.strictEqual(getCategoryKey('cursor-pointer'), 'interactivity');
  assert.strictEqual(getCategoryKey('select-none'), 'interactivity');
  assert.strictEqual(getCategoryKey('pointer-events-none'), 'interactivity');
  assert.strictEqual(getCategoryKey('resize'), 'interactivity');
  assert.strictEqual(getCategoryKey('scroll-smooth'), 'interactivity');

  // Transform
  assert.strictEqual(getCategoryKey('scale-50'), 'transform');
  assert.strictEqual(getCategoryKey('rotate-45'), 'transform');
  assert.strictEqual(getCategoryKey('translate-x-4'), 'transform');
  assert.strictEqual(getCategoryKey('skew-x-12'), 'transform');
  assert.strictEqual(getCategoryKey('origin-center'), 'transform');

  // Filter
  assert.strictEqual(getCategoryKey('blur'), 'filter');
  assert.strictEqual(getCategoryKey('blur-sm'), 'filter');
  assert.strictEqual(getCategoryKey('brightness-50'), 'filter');
  assert.strictEqual(getCategoryKey('grayscale'), 'filter');
  assert.strictEqual(getCategoryKey('backdrop-blur-sm'), 'filter');
  assert.strictEqual(getCategoryKey('drop-shadow-md'), 'filter');

  // Ring/Outline
  assert.strictEqual(getCategoryKey('ring'), 'ringOutline');
  assert.strictEqual(getCategoryKey('ring-2'), 'ringOutline');
  assert.strictEqual(getCategoryKey('outline'), 'ringOutline');
  assert.strictEqual(getCategoryKey('outline-none'), 'ringOutline');

  // Overflow/Display
  assert.strictEqual(getCategoryKey('overflow-hidden'), 'overflowDisplay');
  assert.strictEqual(getCategoryKey('z-10'), 'overflowDisplay');
  assert.strictEqual(getCategoryKey('visible'), 'overflowDisplay');
  assert.strictEqual(getCategoryKey('invisible'), 'overflowDisplay');
  assert.strictEqual(getCategoryKey('hidden'), 'overflowDisplay');
  assert.strictEqual(getCategoryKey('opacity-50'), 'overflowDisplay');

  // Others
  assert.strictEqual(getCategoryKey('aspect-video'), 'others');

  console.log('  getCategoryKey: all passed');
}

// ---------- Variant classification ----------

function testVariantClassification() {
  // Variants should classify based on the base utility
  assert.strictEqual(getCategoryKey('hover:bg-blue-500'), 'background');
  assert.strictEqual(getCategoryKey('md:flex'), 'layout');
  assert.strictEqual(getCategoryKey('dark:text-white'), 'text');
  assert.strictEqual(getCategoryKey('focus:ring-2'), 'ringOutline');
  assert.strictEqual(getCategoryKey('lg:w-1/2'), 'size');
  assert.strictEqual(getCategoryKey('sm:p-4'), 'spacing');
  assert.strictEqual(getCategoryKey('hover:opacity-80'), 'overflowDisplay');
  assert.strictEqual(getCategoryKey('active:scale-95'), 'transform');

  console.log('  variant classification: all passed');
}

// ---------- Arbitrary value classification ----------

function testArbitraryValues() {
  assert.strictEqual(getCategoryKey('w-[100px]'), 'size');
  assert.strictEqual(getCategoryKey('h-[50vh]'), 'size');
  assert.strictEqual(getCategoryKey('bg-[#ff0000]'), 'background');
  assert.strictEqual(getCategoryKey('text-[14px]'), 'text');
  assert.strictEqual(getCategoryKey('p-[10px]'), 'spacing');
  assert.strictEqual(getCategoryKey('top-[20px]'), 'layout');
  assert.strictEqual(getCategoryKey('hover:bg-[#ff0000]'), 'background');
  assert.strictEqual(getCategoryKey('z-[999]'), 'overflowDisplay');

  console.log('  arbitrary values: all passed');
}

// ---------- groupClasses ----------

function testGroupClasses() {
  const classes = ['flex', 'w-full', 'bg-blue-500', 'p-4', 'text-white', 'rounded-lg', 'shadow-md'];
  const result = groupClasses(classes);

  assert.deepStrictEqual(result.size, ['w-full']);
  assert.deepStrictEqual(result.layout, ['flex']);
  assert.deepStrictEqual(result.spacing, ['p-4']);
  assert.deepStrictEqual(result.border, ['rounded-lg']);
  assert.deepStrictEqual(result.background, ['bg-blue-500']);
  assert.deepStrictEqual(result.text, ['text-white']);
  assert.deepStrictEqual(result.effects, ['shadow-md']);

  // Empty input
  const empty = groupClasses([]);
  assert.deepStrictEqual(empty.size, []);
  assert.deepStrictEqual(empty.others, []);

  // Whitespace-only entries are skipped
  const withSpaces = groupClasses(['', '  ', 'flex']);
  assert.deepStrictEqual(withSpaces.layout, ['flex']);
  assert.strictEqual(
    Object.values(withSpaces).reduce((sum, arr) => sum + arr.length, 0),
    1
  );

  console.log('  groupClasses: all passed');
}

// ---------- transformAttribute ----------

function testTransformAttribute() {
  // Basic transform
  const input = 'className="flex w-full h-32 bg-blue-500 text-white p-4 rounded-lg shadow-md"';
  const result = transformAttribute(input);
  assert.ok(result !== null);
  assert.ok(result!.startsWith('className={clsx('));
  assert.ok(result!.includes('// Size'));
  assert.ok(result!.includes('w-full h-32'));
  assert.ok(result!.includes('// Layout'));
  assert.ok(result!.includes('flex'));
  assert.ok(result!.includes('// Background'));
  assert.ok(result!.includes('bg-blue-500'));

  // class attribute (not className)
  const htmlInput = 'class="flex p-4"';
  const htmlResult = transformAttribute(htmlInput);
  assert.ok(htmlResult !== null);
  assert.ok(htmlResult!.startsWith('class={clsx('));

  // Invalid input
  assert.strictEqual(transformAttribute('something else'), null);
  assert.strictEqual(transformAttribute(''), null);

  // With variants
  const variantInput = 'className="flex hover:bg-blue-500 dark:text-white p-4"';
  const variantResult = transformAttribute(variantInput);
  assert.ok(variantResult !== null);
  assert.ok(variantResult!.includes('hover:bg-blue-500'));
  assert.ok(variantResult!.includes('dark:text-white'));

  console.log('  transformAttribute: all passed');
}

// ---------- Run all ----------

console.log('Running tests...\n');

testStripVariants();
testGetCategoryKey();
testVariantClassification();
testArbitraryValues();
testGroupClasses();
testTransformAttribute();

console.log('\nAll tests passed!');
