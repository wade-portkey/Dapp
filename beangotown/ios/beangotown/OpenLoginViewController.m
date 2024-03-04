//
//  OpenLoginViewController.m
//  beangotown
//
//  Created by wade-cui on 2024/2/26.
//

#import "OpenLoginViewController.h"
#import "UIViewController+Top.h"
#import <WebKit/WebKit.h>

@interface OpenLoginViewController () <WKScriptMessageHandler>

@property (nonatomic, strong) WKWebView *webView;

@end

@implementation OpenLoginViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    NSString *js = [[NSBundle mainBundle] pathForResource:@"inject.js" ofType:nil];
    NSData *jsData=[NSData dataWithContentsOfFile:js];
    NSString *jsString =  [[NSString alloc] initWithData:jsData encoding:NSUTF8StringEncoding];
    WKUserScript *jsScript = [[WKUserScript alloc]initWithSource:jsString injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
     
    WKWebViewConfiguration *webConfiguration = [WKWebViewConfiguration new];
    [webConfiguration.userContentController addUserScript:jsScript];
    _webView = [[WKWebView alloc] initWithFrame:[UIScreen mainScreen].bounds configuration:webConfiguration];
    [self.view addSubview:_webView];
    
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"bgt_postMessage"];
    NSString *printContent = @"function bgt_postMessage(obj) { window.webkit.messageHandlers.bgt_postMessage.postMessage(obj);}";
    WKUserScript *userScript = [[WKUserScript alloc] initWithSource:printContent injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
    [self.webView.configuration.userContentController addUserScript:userScript];
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    NSLog(@"message.body: %@",message.body);
    NSLog(@"message.name: %@",message.name);
    if ([@"bgt_postMessage" isEqualToString:message.name]) {
        if (message.body && self.loginCallback) {
            self.loginCallback(message.body);
            [self dismissViewControllerAnimated:YES completion:nil];
        }
    }
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    self.webView.frame = self.view.bounds;
}

- (void)startLoginWithURL:(NSURL *)url {
    [[self topViewController] presentViewController:self animated:YES completion:nil];
    
    NSURLRequest *request = [[NSURLRequest alloc] initWithURL:url];
    [_webView loadRequest:request];
}

@end
