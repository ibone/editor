<script setup lang="ts">
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser, Node} from "prosemirror-model"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "./commands"
import { ref, onMounted } from 'vue'
import {schema} from "./schema"

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: schema.spec.nodes,
  marks: schema.spec.marks
})

// lifecycle hooks
onMounted(() => {
  const view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: Node.fromJSON(mySchema, {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Hello world!"
            }
          ]
        }
      ]
    }),
    plugins: [keymap(baseKeymap)]
  })
})
})
</script>

<template>
  <div id="editor"></div>
</template>