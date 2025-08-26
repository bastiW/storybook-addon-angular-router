import {Router} from "@angular/router";
import { makeDecorator } from "storybook/preview-api";
import { RouterTestingModule } from "@angular/router/testing";
import { moduleMetadata } from "@storybook/angular";
import { ActionLoggingRouter } from "./actionLoggingRouter";

export interface AngularRouterParameters {
    active?: string;
}

export const withAngularRouter = makeDecorator({
    name: 'withAngularRouter',
    parameterName: 'angularRouter',
    wrapper: (storyFn, context, {parameters}: {parameters: AngularRouterParameters}) => {
        // @ts-ignore
      return moduleMetadata({
            imports: [RouterTestingModule],
            providers: [
                {provide: Router, useValue: new ActionLoggingRouter(parameters?.active || '')}
            ]
        })(storyFn);
    }
});