<script>
  import { Body, Heading, Layout } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { getUserBindings } from "builderStore/dataBinding"
  export let bindable = true
  export let queryBindings = []

  const userBindings = getUserBindings()

  let internalBindings = queryBindings.reduce((acc, binding) => {
    acc[binding.name] = binding.default
    return acc
  }, {})
</script>

<Layout noPadding={bindable} gap="S">
  <div class="controls" class:height={!bindable}>
    <Heading size="XS">Bindings</Heading>
  </div>
  <Body size="S">
    {#if !bindable}
      Bindings come in two parts: the binding name, and a default/fallback
      value. These bindings can be used as Handlebars expressions throughout the
      query.
    {:else}
      Enter a value for each binding. The default values will be used for any
      values left blank.
    {/if}
  </Body>
  <div class="bindings" class:bindable>
    <KeyValueBuilder
      bind:object={internalBindings}
      tooltip="Set the name of the binding which can be used in Handlebars statements throughout your query"
      name="binding"
      headings
      keyPlaceholder="Binding name"
      valuePlaceholder="Default"
      bindings={[...userBindings]}
      bindingDrawerLeft="260px"
      on:change
    />
  </div>
</Layout>

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .height {
    height: 40px;
  }
</style>
