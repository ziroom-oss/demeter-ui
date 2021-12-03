import * as d3Selection from 'd3-selection';
export default {
  methods: {
    reRender() {
      if (this.findExistedSvg()) {
        this.findExistedSvg().remove();
      }
    },
    findExistedSvg() {
      return d3Selection.select('#' + this.idName).selectAll('svg');
    }
  }
}