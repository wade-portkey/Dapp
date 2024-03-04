//
//  ViewController.m
//  beangotown
//
//  Created by wade-cui on 2024/2/26.
//

#import "ViewController.h"
#import <WebKit/WebKit.h>
#import "OpenLoginViewController.h"

@interface ViewController () <WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler>

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) OpenLoginViewController *openLoginViewController;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    NSString *js = [[NSBundle mainBundle] pathForResource:@"inject.js" ofType:nil];
    NSData *jsData=[NSData dataWithContentsOfFile:js];
    NSString *jsString =  [[NSString alloc] initWithData:jsData encoding:NSUTF8StringEncoding];
    WKUserScript *jsScript = [[WKUserScript alloc]initWithSource:jsString injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
     
    WKWebViewConfiguration *webConfiguration = [WKWebViewConfiguration new];
    [webConfiguration.userContentController addUserScript:jsScript];
    _webView = [[WKWebView alloc] initWithFrame:[UIScreen mainScreen].bounds configuration:webConfiguration];
    _webView.navigationDelegate = self;
    _webView.UIDelegate = self;
    [self.view addSubview:_webView];
    NSString *urlStr = @"https://www.beangotown.com/";
    NSURL *url = [NSURL URLWithString:urlStr];
    NSURLRequest *request = [[NSURLRequest alloc] initWithURL:url];
    [_webView loadRequest:request];
}

// Decides whether to allow or cancel a navigation.
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {

    NSURL *url = navigationAction.request.URL;

    if ([url.absoluteString hasPrefix:@"http"]) {
        // The target frame, or nil if this is a new window navigation.
        if (!navigationAction.targetFrame) {
            [webView loadRequest:navigationAction.request];
        }
        decisionHandler(WKNavigationActionPolicyAllow);
    } else if ([url.absoluteString hasPrefix:@"file://"]) {
        // 加载本地文件
        if (!navigationAction.targetFrame) {
            [webView loadRequest:navigationAction.request];
        }
        decisionHandler(WKNavigationActionPolicyAllow);
    } else {
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url options:@{UIApplicationOpenURLOptionUniversalLinksOnly: @(NO)} completionHandler:^(BOOL success) {
                // 成功调起三方App之后
                NSLog(@"success：%@", @(success));
            }];
            decisionHandler(WKNavigationActionPolicyCancel);
        } else {
            // was called more than once'
            decisionHandler(WKNavigationActionPolicyCancel);
        }
    }
}

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures{
    
    NSLog(@"navigationAction.request : %@", navigationAction.request);
    if (!navigationAction.targetFrame) {
        [self.openLoginViewController startLoginWithURL:navigationAction.request.URL];
        __weak typeof(self) weakSelf = self;
        self.openLoginViewController.loginCallback = ^(id obj) {
            __strong typeof(self) strongSelf = weakSelf;
            NSString *jsString = [NSString stringWithFormat:@"let bgtLoginObj = %@; window.dispatchEvent('message', bgtLoginObj)", obj];
            NSLog(@"jsString : %@", jsString);
            [strongSelf.webView evaluateJavaScript:jsString completionHandler:^(id _Nullable res, NSError * _Nullable error) {
                NSLog(@"res: %@", res);
                NSLog(@"error: %@", error);
            }];
        };
    }
    return nil;
}

#pragma mark - Getter

- (OpenLoginViewController *)openLoginViewController {
    if (!_openLoginViewController) {
        _openLoginViewController = [OpenLoginViewController new];
    }
    return _openLoginViewController;
}

@end
