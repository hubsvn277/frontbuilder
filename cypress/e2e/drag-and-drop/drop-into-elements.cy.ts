import {
  getContainerForTest,
  interceptPageApi,
  interceptProfilesApi,
  reloadPage,
} from '@cypress/utils';
import { getDropAndNonDropElements } from '@src/utils';
import { generateElementTestId } from '@src/utils/tests';

describe('Drop into droppable elements', () => {
  const { droppableElements, allElements } = getDropAndNonDropElements();

  droppableElements.forEach((element) => {
    allElements.forEach((child) => {
      it(`can drag and drop ${child.type} into ${element.type}`, () => {
        element['data-testid'] = 'droppable-element';

        interceptPageApi(getContainerForTest(element));
        interceptProfilesApi();

        cy.visit('/editor/1/1');

        const source = generateElementTestId(child, true);
        const target = `[data-testid="${element['data-testid']}"]`;

        dragAndDrop(source, target);

        verifyElementExistAsChildren(target, `fr-${child.type.toLowerCase()}`);
      });
    });
  });
});

describe('Drop into non droppable elements', () => {
  const { nonDroppableElements, allElements } = getDropAndNonDropElements();

  nonDroppableElements.forEach((element) => {
    allElements.forEach((child) => {
      it(`can drag and drop ${child.type} into ${element.type}`, () => {
        element['data-testid'] = 'non-droppable-element';

        interceptPageApi(getContainerForTest(element));
        interceptProfilesApi();

        cy.visit('/editor/1/1');

        const source = generateElementTestId(child, true);
        const target = `[data-testid="${element['data-testid']}"]`;
        const testContainer = `[data-testid="test-container"]`;

        dragAndDrop(source, target);

        cy.get(target).children().should('have.length', 0);

        verifyElementExistAsChildren(
          testContainer,
          `fr-${child.type.toLowerCase()}`,
          2
        );
      });
    });
  });
});

const dragAndDrop = (sourceTestId: string, targetTestId: string): any => {
  const dataTransfer = new DataTransfer();
  cy.get(sourceTestId).trigger('dragstart', { dataTransfer });

  cy.get(targetTestId)
    .trigger('dragenter', { dataTransfer })
    .trigger('dragover', { dataTransfer });

  cy.get(sourceTestId).trigger('dragend');
};

const verifyElementExistAsChildren = (
  targetTestId: string,
  childClass: string,
  childCount: number = 1
) => {
  cy.get(targetTestId).children().should('have.length', childCount);
  cy.get(targetTestId).children().should('have.class', childClass);
};
