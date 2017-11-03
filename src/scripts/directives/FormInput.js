export default class FormInput {

  constructor($compile) {
    this.restrict = 'E';
  }

  controller($scope, $compile) {
      $scope.compile = $compile;
  }

  link(scope, element, attrs) {
    const _getTemplate = field => {
      switch (field.type) {
        default: case 'text': return '<input type="text" name="{{field.name}}" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
        case 'cpf': return '<input type="text" name="{{field.name}}" class="mask cpf" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
        case 'number': return '<input type="text" name="{{field.name}}" class="mask number" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
        case 'date': return '<input type="text" name="{{field.name}}" class="mask date" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
        case 'price': return '<input type="text" name="{{field.name}}" ng-model="data[field.name]" currency placeholder="{{field.name}}" ng-readonly="field.readonly">';
        case 'percent': return '<input type="number" name="{{field.name}}" ng-model="data[field.name]" placeholder="{{field.name}}" ng-readonly="field.readonly">';
      }
    }

    const el = scope.compile(_getTemplate(scope.field))(scope);
    element.replaceWith(el);
  }
}
