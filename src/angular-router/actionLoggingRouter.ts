import {of} from "rxjs";
import {action} from "storybook/actions";
import {
  UrlTree,
  type NavigationExtras,
  type UrlCreationOptions,
  UrlSegmentGroup,
  type IsActiveMatchOptions,
} from "@angular/router";

// noinspection JSUnusedGlobalSymbols
export class ActionLoggingRouter {

    activePath?: string;

    constructor(activePath: string) {
        this.activePath = activePath;
    }

    get navigated() {
        return true;
    }

    get routerState() {
        return {};
    }

    get events() {
        return of(undefined)
    }

    get url() {
        return this.activePath;
    }

    serializeUrl(tree: UrlTree | UrlSegmentGroup | string) {
        return this._joinCommands(tree)
    }

    createUrlTree(commands: any[], extras: UrlCreationOptions = {}) {
        return {commands, extras};
    }

    isActive(tree: UrlTree | string, matchOptions: boolean | IsActiveMatchOptions) {
        console.log('isActive', tree, matchOptions)
        if (!this.activePath) {
            return false
        }
        if (matchOptions && (typeof matchOptions === 'boolean' || matchOptions.paths === 'exact')) {
            return this._joinCommands(tree) === this.activePath
        }
        return this._joinCommands(tree).startsWith(this.activePath);
    }


    navigate(commands: any[], extras: NavigationExtras) {
        action('[router] navigate')({commands, extras})
        return Promise.resolve(true);
    }

    navigateByUrl(url: string | UrlTree, extras: NavigationExtras) {
        action('[router] navigateByUrl')({url, extras})
        return Promise.resolve(true);
    }

    _joinCommands(tree: UrlTree | UrlSegmentGroup | string | any) {
        if(typeof tree === 'string') {
            return tree;
        }
        if('commands' in tree && Array.isArray(tree.commands)) {
            return tree.commands.join('/');
        }
        // Handle UrlTree by serializing it to a string
        if(tree instanceof UrlTree) {
            // In a real implementation, we would use tree.toString()
            // For now, just return a placeholder
            return tree.toString();
        }
        return '';
    }

}
