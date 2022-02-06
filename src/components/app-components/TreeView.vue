<template>
  <!-- treeview component -->
  <!-- usage -->
  <!-- <TreeView :list="assetTreeData" @updateSelection="importItemsFromTreeComponent" multiple searchable independent rootSelectable></TreeView> -->

  <v-card class="tree-component-card">
    <v-text-field
      v-model="search"
      :label="$t('appComponents.search')"
      outlined
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
      v-if="searchable"
    ></v-text-field>
    <v-treeview
      :class="classList"
      v-model="selectedTreeViewItems"
      :search="search"
      dense
      selectable
      transition
      return-object
      :items="list"
      item-key='id' 
      item-text='name'
      :selection-type="selectionType"
      open-on-click
      ref="vueTreeView"
    >
    </v-treeview>
  </v-card>
</template>

<style>
.tree-component-card {
  padding-top: 10px !important;
}
.tree-component.root-not-selectable
  .v-treeview-node
  > .v-treeview-node__root
  .v-treeview-node__checkbox {
  display: none !important;
}
.tree-component.root-not-selectable
  .v-treeview-node
  > .v-treeview-node__children
  .v-treeview-node__checkbox {
  display: block !important;
} 
.tree-component.only-leaf-selectable
  .v-treeview-node
  > .v-treeview-node__root
  .v-treeview-node__checkbox {
  display: none !important;
}
.tree-component.only-leaf-selectable
  .v-treeview-node
  .v-treeview-node--leaf
  .v-treeview-node__checkbox {
  display: block !important;
}  
</style> 

<script lang="ts">
import { Watch } from "vue-property-decorator";
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    independent: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    rootSelectable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false
    },
    preSelectedItems: {
      type: Array,
      default: () => [],
    }
  },
})
export default class TreeView extends Vue {
  search: string = "";
  selectionType: string = "leaf";
  selectedTreeViewItems: any = [];
  classList: string[] = ['tree-component'];

  mounted() {
    if(this.$props.independent) this.selectionType = "independent";
    this.itemsListChange();
    this.applyClasses();
    setTimeout(() => this.setPreselectedItems(), 1000);
  }

  @Watch('selectedTreeViewItems')
  selectionChange() {
    if(!this.$props.multiple && this.selectedTreeViewItems.length > 1) {
      this.selectedTreeViewItems = [this.selectedTreeViewItems[this.selectedTreeViewItems.length - 1]];
    }
    else if(!this.$props.readonly) {
      this.sendTreeviewItems();
    }
  }

  @Watch('preSelectedItems')
  setPreselectedItems() {
    if(this.$props.preSelectedItems.length == 0 || this.$props.list.length == 0) {
      return;
    }

    if(this.$props.multiple) {
      this.selectedTreeViewItems = [...this.$props.preSelectedItems];
    }
    else {
      this.selectedTreeViewItems = [this.$props.preSelectedItems[0]];
    }
    this.openSelectedNodes();
  }

  openSelectedNodes() {
    const nodesToBeOpened = [];
    this.getNodesToBeOpened(this.$props.list[0], nodesToBeOpened);
    const vTree: any = this.$refs['vueTreeView'];
    for(let i = 0; i < nodesToBeOpened.length; i++) {
      vTree.updateOpen(nodesToBeOpened[i], true);
    }
  }

  getNodesToBeOpened(node: any, list: any[]) {
    if(node === undefined) return false;
    let openChildCounter = 0;
    node.children?.forEach(childNode => {
      if(this.getNodesToBeOpened(childNode, list)) {
        openChildCounter++;
      }
    });
    const filteredList = this.selectedTreeViewItems.filter(x => x.id == node.id);
    if(filteredList.length > 0 || openChildCounter > 0) {
      list.unshift(node.id);
      return true;
    }
  }

  @Watch('rootSelectable')
  @Watch('independent')
  @Watch('multiple')
  applyClasses() {
    this.classList = ['tree-component'];
    if(!this.$props.independent && !this.$props.multiple) {
      this.classList.push('only-leaf-selectable');
    }
    else if(!this.$props.rootSelectable) {
      this.classList.push('root-not-selectable');
    }
  }

  @Watch('list')
  itemsListChange() {
    if(this.$props.readonly && this.$props.list.length > 0) {
      this.recursiveUpdate(this.$props.list[0]);
    }
  }

  recursiveUpdate(node: any) {
    node.disabled = true;
    node.children?.forEach((childNode) => {
      this.recursiveUpdate(childNode);
    });
  }

  sendTreeviewItems() {
    if(!this.$props.multiple) {
      this.$emit('updateSelection', this.selectedTreeViewItems[0]);
    }
    else {
      this.$emit('updateSelection', this.selectedTreeViewItems);
    }
  }

  data() {
    return {
      search: "",
    };
  }
}
</script>
