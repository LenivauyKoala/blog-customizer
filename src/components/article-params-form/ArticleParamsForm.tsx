import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import { RadioGroup } from '../../ui/radio-group';
import { Select } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Text } from '../../ui/text';

import {
	OptionType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType
} from '../../constants/articleProps'

import { useState, useRef, FormEvent, useCallback, useEffect } from 'react';
import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

export type ArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	setCurrentArticleState: (articleState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ currentArticleState, setCurrentArticleState }: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
  const [formsState, setFormsState] = useState<ArticleStateType>(currentArticleState);
  const sidebarRef = useRef<HTMLDivElement>(null);

	const formApply = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();	
		setCurrentArticleState(formsState);
	}, [formsState, setCurrentArticleState]);

	const formChange = useCallback((fieldName: string) => {
		return (value: OptionType) => {
			setFormsState((prevState) => ({
				...prevState,
				[fieldName]: value,
			}));
		};
	}, []);	

	const formReset = useCallback(() => {
		setFormsState(defaultArticleState);
		setCurrentArticleState(defaultArticleState);
	}, [setCurrentArticleState]);

	const formOpen = useCallback(() => {
		setIsOpen((prevState) => !prevState);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
				if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
						setIsOpen(false);
				}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
				document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={formOpen} />
			<aside 
				ref={sidebarRef}
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form className={styles.form} onSubmit={formApply} onReset={formApply}>
					<Text uppercase={true} weight={800} size={31}>
            Задайте параметры
          </Text>
					<Select
						title={'Шрифт'}
						options={fontFamilyOptions}
						selected={formsState.fontFamilyOption}
						onChange={formChange('fontFamilyOption')}
          />
					<RadioGroup
						title={'Размер шрифта'}
						name={'fontSize'}
						options={fontSizeOptions}
						selected={formsState.fontSizeOption}
						onChange={formChange('fontSizeOption')}
					/>
					<Select
						title={'Цвет шрифта'}
						options={fontColors}
						selected={formsState.fontColor}
						onChange={formChange('fontColor')}
					/>
					<Separator />
					<Select
						title={'Цвет фона'}
						options={backgroundColors}
						selected={formsState.backgroundColor}
						onChange={formChange('backgroundColor')}
					/>
					<Select
						title={'Ширина контента'}
						options={contentWidthArr}
						selected={formsState.contentWidth}
						onChange={formChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button 
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={formReset}
						/>
						<Button 
							title='Применить'
							htmlType='submit'
							type='apply'
						/>
					</div>
				</form>
			</aside>
		</>
	);
};
